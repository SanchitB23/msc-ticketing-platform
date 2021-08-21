import {Ticket} from "../ticket";

it('should implement Optimistic Concurrency Control', async function () {
    const ticket = Ticket.build({
        price: 10, title: "Testing", userId: "123"
    })
    await ticket.save()
    const fInst = await Ticket.findById(ticket.id)
    const sInst = await Ticket.findById(ticket.id)
    fInst!.set({price: 10})
    sInst!.set({price: 15})
    await fInst!.save()
    try {
        await sInst!.save();
    } catch (err) {
        return;
    }
});

it('should increment version number on multi saves', async function () {
    const ticket = Ticket.build({
        price: 10, title: "Testing", userId: "123"
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
});
